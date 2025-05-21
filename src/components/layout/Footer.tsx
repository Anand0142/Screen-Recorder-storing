import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t mt-auto py-6 bg-background">
      <div className="container flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ScreenVault. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
