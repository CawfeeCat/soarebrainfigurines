// Wait for the page to load
document.addEventListener('DOMContentLoaded', function (
) {
 // Get your elements by your existing IDs
const banner = document.getElementById('errorBannerLink')
 const dismiss = document.getElementById('errorBannerDismiss')
 const triggers = document.querySelectorAll('.banner-trigger')

 // If elements exist, set up the behavior
if (banner && dismiss && triggers.length > 0) {
 // Show banner and focus dismiss button
function showBanner(
) {
 banner.classList.remove('d-none')
 banner.style.display = 'block'
// Focus the dismiss button — keyboard accessible!
setTimeout(() => dismiss.focus(), 100)
 }

 // Hide banner
function hideBanner(e) {
 e.preventDefault()
 banner.classList.add('d-none')
 }

 // Attach click to all triggers
triggers.forEach(trigger => {
 trigger.addEventListener('click', e => {
 e.preventDefault()
 showBanner()
 })
 })

 // Attach dismiss click
dismiss.addEventListener('click', hideBanner)

 // Make dismiss button keyboard-friendly
dismiss.setAttribute('tabindex', '0')
 dismiss.setAttribute('role', 'button')
 dismiss.addEventListener('keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault()
 hideBanner(e)
 }
 })
 }
})

function initDecoyLinkBanner(config) {
 return initBannerController({
 bannerId: config.bannerId,
 dismissId: config.dismissId,
 triggerSelector: config.triggerSelector,
 triggerEvent: config.triggerEvent || 'click',
 preventDefault: config.preventDefault !== false,
 focusDismissOnShow: true // ✅ This ensures the dismiss button gets focus!
})
}


function initImagePreviewModal(config) {
	var modal = document.getElementById(config.modalId)
	var modalImage = document.getElementById(config.imageId)
	var modalTitle = config.titleId ? document.getElementById(config.titleId) : null
	var triggerSelector = config.triggerSelector || '[data-image-preview]'
	var triggers = document.querySelectorAll(triggerSelector)
	var lastTrigger = null

	if (!modal || !modalImage || triggers.length === 0) {
		return null
	}

	var modalInstance = bootstrap.Modal.getOrCreateInstance(modal)

	function openPreview(trigger) {
		if (!trigger) {
			return
		}

		lastTrigger = trigger
		modalImage.src = trigger.getAttribute('data-preview-src') || trigger.getAttribute('src')
		modalImage.alt = trigger.getAttribute('data-preview-alt') || trigger.alt || ''

		if (modalTitle) {
			modalTitle.textContent = trigger.getAttribute('data-preview-title') || trigger.alt || 'Image preview'
		}

		modalInstance.show()
	}

	triggers.forEach(function (trigger) {
		trigger.setAttribute('role', 'button')
		trigger.setAttribute('tabindex', '0')

		trigger.addEventListener('click', function () {
			openPreview(trigger)
		})

		trigger.addEventListener('keydown', function (event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault()
				openPreview(trigger)
			}
		})
	})

	modal.addEventListener('hidden.bs.modal', function () {
		if (lastTrigger && typeof lastTrigger.focus === 'function') {
			lastTrigger.focus()
		}
	})

	return {
		show: openPreview
	}
}

// Check on load: has user dismissed the banner?
if (localStorage.getItem('dataBannerDismissed') === 'true') {
  const banner = document.getElementById('dataBanner')
  if (banner) {
    banner.classList.remove('show')
    banner.style.display = 'none'
}
}

// Save when dismissed
document.getElementById('dataBanner')?.addEventListener('close.bs.alert', function (
) {
  localStorage.setItem('dataBannerDismissed', 'true')
})

document.addEventListener('DOMContentLoaded', function (
) {
  const banner = document.getElementById('dataBanner')
  // Only focus if banner is still visible
if (banner && getComputedStyle(banner).display !== 'none') {
    const dismissButtons = banner.querySelectorAll('[data-bs-dismiss="alert"]')
    if (dismissButtons.length > 0) {
      dismissButtons[0].focus() // Keyboard users land here first
}
  }
})
