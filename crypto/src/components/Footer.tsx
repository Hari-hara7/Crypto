import { FC } from "react";

const Footer: FC = () => (
  <footer className="bg-primary text-white py-4 text-center mt-auto">
    <p>© {new Date().getFullYear()} Crypto Tracker. All rights reserved.</p>
  </footer>
);

export default Footer;
