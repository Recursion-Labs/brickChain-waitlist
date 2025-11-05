/**
 * Email validation utilities
 */

// Common disposable email domains that are often used for spam
const DISPOSABLE_EMAIL_DOMAINS = [
	'10minutemail.com',
	'guerrillamail.com',
	'mailinator.com',
	'temp-mail.org',
	'yopmail.com',
	'maildrop.cc',
	'tempmail.net',
	'throwaway.email',
	'fakeinbox.com',
	'mailcatch.com',
	'dispostable.com',
	'mail-temporaire.fr',
	'tempail.com',
	'getnada.com',
	'mailnesia.com',
	'spamgourmet.com',
	'0-mail.com',
	'027168.com',
	'anonbox.net',
	'mohmal.com',
	'mailnull.com',
	'spam4.me',
	'grr.la',
	'incognitomail.org',
	'kurzepost.de',
	'lifebyfood.com',
	'objectmail.com',
	'obobbo.com',
	'rcpt.at',
	'safersignup.de',
	'saynotospams.com',
	'selfdestructingmail.com',
	'shieldedmail.com',
	'spamfree24.org',
	'spambob.com',
	'spambog.com',
	'spambog.de',
	'spamcannibal.org',
	'spamcero.com',
	'spamcon.org',
	'spamcorptastic.com',
	'spamcowboy.com',
	'spamcowboy.net',
	'spamcowboy.org',
	'spamday.com',
	'spamex.com',
	'spamgourmet.com',
	'spamgourmet.net',
	'spamgourmet.org',
	'spamhole.com',
	'spamify.com',
	'spaminator.de',
	'spamkill.info',
	'spaml.com',
	'spaml.de',
	'spammotel.com',
	'spamobox.com',
	'spamspot.com',
	'spamthis.co.uk',
	'spamthisplease.com',
	'spidersendmail.com',
	'suremail.info',
	'tempalias.com',
	'thankyou2010.com',
	'thisisnotmyrealemail.com',
	'throam.com',
	'tilien.com',
	'tmailinator.com',
	'tradermail.info',
	'trash2009.com',
	'trashemail.de',
	'trashymail.com',
	'tyldd.com',
	'uggsrock.com',
	'upliftnow.com',
	'uplipht.com',
	'venompen.com',
	'walkmail.net',
	'wetrainbayarea.com',
	'wetrainbayarea.org',
	'wh4f.org',
	'whyspam.me',
	'willselfdestruct.com',
	'xoxy.net',
	'yuurok.com',
	'zehnminutenmail.de',
	'zetmail.com',
	'zippymail.info',
	'zoemail.org'
];

/**
 * Validates email format using comprehensive regex
 * This regex follows RFC 5322 standards and handles most valid email formats
 */
export const isValidEmailFormat = (email: string): boolean => {
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return emailRegex.test(email);
};

/**
 * Checks if email domain is from a disposable email service
 */
export const isDisposableEmail = (email: string): boolean => {
	const domain = email.split('@')[1]?.toLowerCase();
	return domain ? DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
};

/**
 * Comprehensive email validation
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
	if (!email || typeof email !== 'string') {
		return { isValid: false, error: 'Email is required' };
	}

	const trimmedEmail = email.trim().toLowerCase();

	if (!isValidEmailFormat(trimmedEmail)) {
		return { isValid: false, error: 'Invalid email format' };
	}

	if (isDisposableEmail(trimmedEmail)) {
		return { isValid: false, error: 'Disposable email addresses are not allowed' };
	}

	// Additional checks for suspicious patterns
	const suspiciousPatterns = [
		/^\d{10,}@/, // Emails starting with long numbers
		/@.*\d{8,}/, // Domains with long numbers
		/@(test|example|sample|fake|spam)\./, // Common test domains
		/@.*\.(test|example|invalid|localhost)$/, // Invalid TLDs
	];

	for (const pattern of suspiciousPatterns) {
		if (pattern.test(trimmedEmail)) {
			return { isValid: false, error: 'Invalid email address' };
		}
	}

	return { isValid: true };
};