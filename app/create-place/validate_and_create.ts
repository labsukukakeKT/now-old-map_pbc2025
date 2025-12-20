'use server'

import { prisma } from '@/lib/prisma'

export async function createPlace(formData: FormData) {
	const placeName = (formData.get('place_name') ?? '') as string
	const periodStartYearString = (formData.get('period_start_year') ?? '') as string
	const periodEndYearString = (formData.get('period_end_year') ?? '') as string
	const descriptionMarkdown = (formData.get('description_markdown') ?? '') as string
	const latitudeString = (formData.get('latitude') ?? '') as string
	const longitudeString = (formData.get('longitude') ?? '') as string
	const mainImageUrl = (formData.get('main_image_url') ?? '') as string

	const errors: string[] = []

	// required fields
	if (!placeName || placeName.trim() === '') errors.push('Place name is required.')
	if (!descriptionMarkdown || descriptionMarkdown.trim() === '') errors.push('Description is required.')

	// latitude / longitude: required numbers and ranges
	const latitude = latitudeString !== '' ? Number(latitudeString) : NaN
	const longitude = longitudeString !== '' ? Number(longitudeString) : NaN
	if (Number.isNaN(latitude)) errors.push('Latitude is required and must be a number.')
	else if (latitude < -90 || latitude > 90) errors.push('Latitude must be between -90 and 90.')
	if (Number.isNaN(longitude)) errors.push('Longitude is required and must be a number.')
	else if (longitude < -180 || longitude > 180) errors.push('Longitude must be between -180 and 180.')

	// years: optional, numeric if present, <= 3000
	const periodStartYear = periodStartYearString !== '' ? Number(periodStartYearString) : null
	const periodEndYear = periodEndYearString !== '' ? Number(periodEndYearString) : null
	if (periodStartYear != null) {
		if (!Number.isFinite(periodStartYear) || periodStartYear > 3000) errors.push('Period start year must be a number ≤ 3000.')
	}
	if (periodEndYear != null) {
		if (!Number.isFinite(periodEndYear) || periodEndYear > 3000) errors.push('Period end year must be a number ≤ 3000.')
	}

	// mainImageUrl: optional, but if present must look like an image URL
	function isValidImageUrl(u?: string) {
		if (!u) return false
		try {
			const parsed = new URL(u)
			const ext = (parsed.pathname.split('.').pop() ?? '').toLowerCase()
			return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext) || u.startsWith('data:image')
		} catch {
			return false
		}
	}
	if (mainImageUrl && mainImageUrl.trim() !== '' && !isValidImageUrl(mainImageUrl)) {
		errors.push('Main image URL (if provided) must be a valid image URL.')
	}

	if (errors.length > 0) {
		// surface errors to the caller
		throw new Error('Validation error: ' + errors.join(' '))
	}

	// create entry in place_DB (use the model name exactly)
	const created = await prisma.place_DB.create({
		data: {
			lat: latitude,
			lng: longitude,
			place_name: placeName,
			place_description: descriptionMarkdown,
			place_photo_url: mainImageUrl || null,
			place_era_start: periodStartYear,
			place_era_end: periodEndYear,
		},
	})

	// return created record instead of redirect (API route will respond)
	return created
}