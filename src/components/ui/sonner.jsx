import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--white-1)",
          "--normal-text": "var(--white-9)",
          "--normal-border": "var(--white-4)"
        }
      }
      {...props} />
  );
}

export { Toaster }
