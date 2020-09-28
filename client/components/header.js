import Link from "next/link";

const Header = ({ currenUser }) => {
  const links = [
    !currenUser && { label: "Sign Up", href: "/auth/signup" },
    !currenUser && { label: "Sign In", href: "/auth/signin" },
    currenUser && { label: "Sell Tickets", href: "/tickets/new" },
    currenUser && { label: "My Orders", href: "/orders" },
    currenUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix ATR</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
