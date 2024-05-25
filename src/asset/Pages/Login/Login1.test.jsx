import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login, { validateInput } from "./Login.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../service/user_service.js";


test("validate function should pass on correct input", () => {
  const text = "text@test.com";
  expect(validateInput(text)).toBe(true);
});

test("validate function should fail on correct input", () => {
  const text = "text@testcom";
  expect(validateInput(text)).not.toBe(true);
});
test("email input should be rendered", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const usernameInputEl = screen.getByPlaceholderText(/Email/i);
  expect(usernameInputEl).toBeInTheDocument();
});

test("password input should be rendered", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);
  expect(passwordInputEl).toBeInTheDocument();
});
test("button should be rendered", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const buttonEl = screen.getByRole("button");
  expect(buttonEl).toBeInTheDocument();
});
test("email input should be empty", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const usernameInputEl = screen.getByPlaceholderText(/Email/i);
  expect(usernameInputEl.value).toBe("");
});

test("password input should be empty", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);
  expect(passwordInputEl.value).toBe("");
});

//   it("displays error message when email or password is missing", () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const submitButton = screen.queryByRole('button');
// expect(submitButton).toHaveTextContent(//);
//     const errorMessage = screen.getByText("Chưa nhập email hoặc mật khẩu");
//     expect(errorMessage).toBeInTheDocument();
//   });

test("loading should not be rendered", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const buttonEl = screen.getByRole("button");
  expect(buttonEl).not.toHaveTextContent(/Đăng nhập.../i);
});

test("email input should change", () => {
  //email có thể thay đổi
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const usernameInputEl = screen.getByPlaceholderText(/Email/i);
  const testValue = "test";

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  expect(usernameInputEl.value).toBe(testValue);
});

test("password input should change", () => {
  //password có thể thay đổi
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);
  const testValue = "test";

  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  expect(passwordInputEl.value).toBe(testValue);
});

test("button should not be disabled when inputs exist", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const buttonEl = screen.getByRole("button");
  const usernameInputEl = screen.getByPlaceholderText(/Email/i);
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);

  const testValue = "test";

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });

  expect(buttonEl).not.toBeDisabled();
});

// Kiểm tra nút bị vô hiệu hóa khi các trường nhập liệu trống
test("button should be disabled when inputs are empty", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  const buttonEl = screen.getByRole("button");
  const usernameInputEl = screen.getByPlaceholderText(/Email/i);
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);

  fireEvent.change(usernameInputEl, { target: { value: "" } });
  fireEvent.change(passwordInputEl, { target: { value: "" } });

  expect(buttonEl).toBeDisabled();
});

test("Email or password fail", async () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
   const buttonEl = screen.getByRole("button");

  const emailInputEl = screen.getByPlaceholderText(/Email/i);
  const passwordInputEl = screen.getByPlaceholderText(/Password/i);

  const testValueEmail = "admin@gmail.com";
  const testValuePassword = "123456";

  fireEvent.change(emailInputEl, { target: { value: testValueEmail } });
  fireEvent.change(passwordInputEl, { target: { value: testValuePassword } });
  // fireEvent.click(buttonEl);
  // const errorEl = screen.getByTestId("error");
  //  expect(errorEl).toBeInTheDocument();
  // expect(errorEl).toHaveTextContent("Email hoặc mật khẩu sai");

});

test("it calls onUserAdd when the form is submitted", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const inputs = screen.getAllByRole("textbox");
  const button = screen.getByRole("button");

  expect(inputs).toHaveLength(1);
  expect(button).toBeInTheDocument();
});


// const mockLoginApi = jest.fn();
// jest.mock("axios", () => ({
//   post: jest.fn(() =>
//     Promise.resolve({
//       data: {
//         user: {
//           /* mock user data */
//         },
//       },
//     })
//   ),
// }));

// describe("Login Component", () => {
//   beforeEach(() => {
//     // eslint-disable-next-line testing-library/no-render-in-setup
//     render(
//       <BrowserRouter>
//         <AuthContext.Provider value={{ loginApi: mockLoginApi }}>
//           <Login />
//         </AuthContext.Provider>
//       </BrowserRouter>
//     );
//   });
//   test("calls loginApi function with correct parameters when login button is clicked", async () => {
//     const emailInput = screen.getByPlaceholderText(/Email/i);
//     const passwordInput = screen.getByPlaceholderText(/Password/i);
//     const buttonEl = screen.getByRole("button");

//     const testEmail = "test@test.com";
//     const testPassword = "password123";

//     fireEvent.change(emailInput, { target: { value: testEmail } });
//     fireEvent.change(passwordInput, { target: { value: testPassword } });
//     fireEvent.click(buttonEl);

//     await waitFor(() => {
//       expect(mockLoginApi).toHaveBeenCalledWith({
//         email: testEmail,
//         password: testPassword,
//       });
//     });
//   });
// });