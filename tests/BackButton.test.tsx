import React from "react";
import { render, screen } from "@testing-library/react";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BackButton", () => {
  it("renders button", () => {
    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });

    render(<BackButton />);
    const link = screen.getByRole("link", { name: /back/i });

    expect(link).toBeInTheDocument();
  });
});
