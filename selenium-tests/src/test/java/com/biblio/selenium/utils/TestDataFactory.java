package com.biblio.selenium.utils;

import java.util.UUID;

public final class TestDataFactory {

    public static final String SELENIUM_EMAIL_DOMAIN = "@selenium.test";
    public static final String ISBN_PREFIX = "978-sel-";
    public static final String BOOK_TITLE_PREFIX_LECTEUR = "Livre Selenium ";
    public static final String BOOK_TITLE_PREFIX_BIBLIO = "Biblio Book ";

    private TestDataFactory() {
    }

    public static String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + SELENIUM_EMAIL_DOMAIN;
    }

    public static String uniqueIsbn() {
        return ISBN_PREFIX + UUID.randomUUID().toString().substring(0, 8);
    }

    public static boolean isSeleniumTestEmail(String email) {
        return email != null && email.endsWith(SELENIUM_EMAIL_DOMAIN);
    }

    public static boolean isSeleniumTestBook(String titre, String isbn) {
        if (isbn != null && isbn.startsWith(ISBN_PREFIX)) {
            return true;
        }
        if (titre == null) {
            return false;
        }
        return titre.startsWith(BOOK_TITLE_PREFIX_LECTEUR)
                || titre.startsWith(BOOK_TITLE_PREFIX_BIBLIO);
    }

    public static String defaultPassword() {
        return "secret123";
    }

    public static String defaultTemporaryPassword() {
        return "ChangeMe123";
    }
}
