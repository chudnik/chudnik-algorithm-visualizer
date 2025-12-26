export const EVENT_TYPES = {
    SYSTEM: {
        INIT: 'system:init',
        READY: 'system:ready',
        ERROR: 'system:error',
    },

    ALGORITHM: {
        INIT: 'algorithm:init',
        START: 'algorithm:start',
        PAUSE: 'algorithm:pause',
        RESUME: 'algorithm:resume',
        STOP: 'algorithm:stop',
        ERROR: 'algorithm:error',
    }
}

export const EVENT_SCHEMAS = {
    [EVENT_TYPES.SYSTEM.INIT]: {
        timestamp: 'number',
        version: 'string',
    }
}

export class EventValidator {
    static validate(eventType, data) {
        const schema = EVENT_SCHEMAS[eventType];
        if (!schema) {
            throw new Error(`No schema defined for event: ${eventType}`);
        }
        for (const [key, expectedType] of Object.entries(schema)) {
            if (!(key in data)) {
                throw new Error(`Missing required field '${key}' in event: ${eventType}`);
            }
            const actualType = typeof data[key];
            if (actualType !== expectedType && expectedType !== 'any') {
                throw new Error(`Field '${key}' must be type '${expectedType}', got ${actualType}`);
            }
        }
        return true;
    }
}