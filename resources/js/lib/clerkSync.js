import axios from 'axios';

/**
 * Synchronize Clerk session with Laravel application session.
 * Accepts the Clerk instance (or active session) and an optional isRegistration boolean.
 * Sends the session token as a Bearer token in the Authorization header.
 *
 * @param {object} clerk
 * @param {boolean} isRegistration
 * @returns {Promise<any>}
 */
export async function clerkSync(clerk, isRegistration = false) {
    const session = clerk?.session ?? clerk;
    if (!session || typeof session.getToken !== 'function') {
        throw new Error('No active Clerk session available to obtain token.');
    }

    const token = await session.getToken();
    if (!token) {
        throw new Error('Failed to retrieve token from Clerk session.');
    }

    return axios.post(
        '/clerk-sync',
        {
            is_registration: Boolean(isRegistration),
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export default clerkSync;
