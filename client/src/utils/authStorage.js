const REGISTERED_USERS_KEY = "foodshare-registered-users";

export function getRegisteredUsers() {
  try {
    const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Unable to read registered users.", error);
    return [];
  }
}

export function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const normalizedEmail = user.email.trim().toLowerCase();

  if (!users.some((registeredUser) => registeredUser.email === normalizedEmail)) {
    localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify([...users, { ...user, email: normalizedEmail }]),
    );
  }
}
