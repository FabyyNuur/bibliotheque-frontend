package com.biblio.selenium.utils;

import java.util.UUID;

public final class TestDataFactory {

    private TestDataFactory() {
    }

    public static String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@selenium.test";
    }

    public static String uniqueIsbn() {
        return "978-sel-" + UUID.randomUUID().toString().substring(0, 8);
    }

    public static String defaultPassword() {
        return "secret123";
    }

    public static String defaultTemporaryPassword() {
        return "ChangeMe123";
    }
}
