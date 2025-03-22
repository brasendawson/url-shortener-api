const tokenBlacklist = new Set();

export const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};