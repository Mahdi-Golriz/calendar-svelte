/**
 * @typedef {Object} CalendarEvent
 * @property {number} id
 * @property {number} [originalEventId]
 * @property {string} title
 * @property {string} [name]
 * @property {string} startDate
 * @property {string} [start]
 * @property {string} endDate
 * @property {string} [end]
 * @property {string} [description]
 * @property {string} [place]
 * @property {string} [category]
 * @property {string} [color]
 * @property {number[]} [persons]
 */

/**
 * @typedef {Object} Person
 * @property {number} id
 * @property {string} name
 * @property {string} title
 */

/**
 * @typedef {Object} ProcessedEvent
 * @property {number} id
 * @property {number} originalEventId
 * @property {number|string} personId
 * @property {string} start
 * @property {string} end
 * @property {string} name
 * @property {string} color
 * @property {boolean} isMultiPerson
 * @property {boolean} isClamped
 * @property {boolean} clampedStart
 * @property {boolean} clampedEnd
 * @property {number[]} [persons]
 */

export {}; // Make this a module
