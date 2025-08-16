import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "@/app/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HomePage", () => {
  it("does not navigate if nickname has less than 3 characters", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<HomePage />);
    const input = screen.getByLabelText(/your nickname/i);
    const button = screen.getByRole("button", { name: /start game/i });

    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.click(button);

    expect(push).not.toHaveBeenCalled();
  });

  it("navigates if nickname has at least 3 characters", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<HomePage />);
    const input = screen.getByLabelText(/your nickname/i);
    const button = screen.getByRole("button", { name: /start game/i });

    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(button);

    expect(push).toHaveBeenCalledWith("/game?nickname=abc");
  });
});
