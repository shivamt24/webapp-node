import userService from "../../api/services/user.service";

test('Returns query to update user', () => {
    let mock = {
        "first_name": "Sachin",
        "last_name": "Tendulkar"
    };
    expect(userService.updateUserByID("3", mock)).toBe("UPDATEE users SET first_name = 'Sachin', last_name = 'Tendulkar' WHERE id = 3");
})
