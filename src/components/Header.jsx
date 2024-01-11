// components/Header.jsx
import React from 'react';
import Link from 'next/link';

import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link legacyBehavior href="/">
          <a className={styles.logo}>Next.js App</a>
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link legacyBehavior href="/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/contact">
              <a>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
