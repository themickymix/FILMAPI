import React from "react";

function Footer() {
  return (
    <footer className="footer bg-neutral text-neutral-content items-center p-4 mt-24 rounded-tr-lg rounded-tl-xl">
      <aside className="md:grid-flow-col items-center">
      
        <p>Created by: Michael Yalon</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        {/* GitHub Icon */}
        <a
          href="https://github.com/themickymix"
          target="_blank"
          rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current">
            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.299 3.438 9.801 8.207 11.392.6.111.793-.26.793-.577 0-.287-.01-1.048-.015-2.062-3.338.726-4.043-1.608-4.043-1.608-.545-1.383-1.333-1.75-1.333-1.75-1.089-.743.083-.73.083-.73 1.205.084 1.838 1.24 1.838 1.24 1.07 1.831 2.805 1.302 3.493.998.107-.776.42-1.303.76-1.603-2.665-.305-5.464-1.33-5.464-5.926 0-1.308.47-2.381 1.243-3.221-.125-.305-.538-.92-.073-1.864 0 0 1.008-.325 3.304 1.24 1.168-.326 2.417-.489 3.661-.493 1.245.004 2.495.167 3.661.493 2.297-1.565 3.304-1.24 3.304-1.24.465.944.052 1.559-.073 1.864.773.839 1.243 1.913 1.243 3.221 0 4.601-2.799 5.617-5.474 5.922.43.375.81 1.106.81 2.227 0 1.608-.015 2.899-.015 3.29 0 .318.193.691.798.577C20.563 21.801 24 17.298 24 12c0-6.627-5.373-12-12-12z"></path>
          </svg>
        </a>

        {/* LinkedIn Icon */}
        <a
          href="https://www.linkedin.com/in/michaelyalon/"
          target="_blank"
          rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current">
            <path d="M20.447 0h-16.894c-1.45 0-2.447 1.067-2.447 2.447v16.894c0 1.45 1.067 2.447 2.447 2.447h16.894c1.45 0 2.447-1.067 2.447-2.447v-16.894c0-1.45-1.067-2.447-2.447-2.447zm-11.236 18.857h-2.99v-8.718h2.99v8.718zm-1.49-9.924c-.973 0-1.66-.717-1.66-1.618s.687-1.617 1.66-1.617c.973 0 1.66.717 1.66 1.617s-.687 1.618-1.66 1.618zm10.667 9.924h-2.99v-4.35c0-1.025-.367-1.725-1.281-1.725-.697 0-1.112.469-1.297.92-.067.163-.083.39-.083.619v4.493h-2.99v-8.718h2.99v1.177c1.046-1.608 3.018-1.296 3.018 1.137v6.404z"></path>
          </svg>
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
