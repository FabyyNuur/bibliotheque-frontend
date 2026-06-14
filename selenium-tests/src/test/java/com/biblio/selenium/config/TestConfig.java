package com.biblio.selenium.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class TestConfig {

    private static final Properties PROPERTIES = new Properties();

    static {
        try (InputStream input = TestConfig.class.getClassLoader().getResourceAsStream("test.properties")) {
            if (input == null) {
                throw new IllegalStateException("test.properties introuvable");
            }
            PROPERTIES.load(input);
        } catch (IOException e) {
            throw new IllegalStateException("Impossible de charger test.properties", e);
        }
    }

    private TestConfig() {
    }

    public static String getBaseUrl() {
        return getProperty("base.url", "http://localhost:3001");
    }

    public static String getApiUrl() {
        return getProperty("api.url", "http://localhost:3000/api");
    }

    public static String getBiblioEmail() {
        return getProperty("biblio.email", "admin@biblio.com");
    }

    public static String getBiblioPassword() {
        return getProperty("biblio.password", "secret123");
    }

    public static boolean isHeadless() {
        String systemOverride = System.getProperty("headless");
        if (systemOverride != null) {
            return Boolean.parseBoolean(systemOverride);
        }
        return Boolean.parseBoolean(getProperty("headless", "true"));
    }

    public static int getExplicitWaitSeconds() {
        return Integer.parseInt(getProperty("explicit.wait.seconds", "10"));
    }

    private static String getProperty(String key, String defaultValue) {
        String systemValue = System.getProperty(key.replace('.', '-'));
        if (systemValue != null) {
            return systemValue;
        }
        return PROPERTIES.getProperty(key, defaultValue);
    }
}
