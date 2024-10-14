import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import App from "./App";

describe("App Component", () => {
  afterEach(cleanup);

  it("renders with default props", () => {
    const view = render(<App />);
    expect(view.asFragment()).toMatchSnapshot();
  });

  describe("Counter Button", () => {
    it("increments counter on click", async () => {
      render(<App />);
      const button = screen.getByRole("button", { name: /count is 0/i });
      expect(button).toBeInTheDocument();

      const user = userEvent.setup();

      await user.click(button);
      expect(button).toHaveTextContent(/count is 1/i);

      await user.click(button);
      expect(button).toHaveTextContent(/count is 2/i);
    });
  });
});
