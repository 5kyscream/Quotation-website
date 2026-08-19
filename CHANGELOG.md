# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Google Sign-In**: Added a "Continue with Google" button to the login page for simpler onboarding.
- **Security Check**: Enforced a strict domain restriction for Google logins, ensuring only `@vykonindustechnologies.com` accounts can access the system. Users logging in with other domains are immediately signed out with an alert.
- **Password Reset Flow**: Added a "Forgot password?" link to the login screen that integrates with Supabase to send secure reset links.

### Changed
- **Input Styling**: Updated the email and password input fields on the login page to have a white background with dark text, improving visibility against the dark theme.
- **Background Grid**: Increased the opacity of the background grid pattern in dark mode to make it more visible and aesthetically pleasing.
- **PDF Logo**: Replaced the placeholder HTML/CSS text logo on the PDF cover page with the actual, higher-resolution Vykon Proposal Studio image logo (`logo.png`).

### Fixed
- **Grid Overlap**: Fixed a layout bug where the background grid pattern was overlapping UI elements in the form area by correcting the z-index stacking context.
- **Preview Background**: Removed the harsh black background (`#0b0c10`) from the PDF preview panel, allowing it to blend seamlessly with the main app background.
- **Scrollbar UI**: Hid the clunky generic native scrollbars that were appearing under the step indicator (looking like a slider) and between the wizard panels, while maintaining scroll functionality.
