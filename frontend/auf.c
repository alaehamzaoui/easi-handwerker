#include <stdio.h>

// Define a function to authenticate a user
int authenticate(unsigned char password) {
unsigned char stored_password = 1; // stored password

// Check if the provided password matches the stored password
if (password == stored_password) {
printf("Authentication successful!");
return 1; // authentication successful
} else {
printf("Authentication failed!");
return 0; // authentication failed
}
}

int main() {
unsigned char password;
printf("Enter password to authenticate: ");
scanf("%hhu", &password);

if (authenticate(password)) {
printf("Welcome!");
} else {
printf("Access denied!");
}

return 0;
}