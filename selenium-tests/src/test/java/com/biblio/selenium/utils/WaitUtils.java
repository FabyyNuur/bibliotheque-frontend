package com.biblio.selenium.utils;

import com.biblio.selenium.config.TestConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public final class WaitUtils {

    private WaitUtils() {
    }

    public static WebDriverWait createWait(WebDriver driver) {
        return new WebDriverWait(driver, Duration.ofSeconds(TestConfig.getExplicitWaitSeconds()));
    }

    public static void waitForPageLoad(WebDriver driver) {
        WebDriverWait wait = createWait(driver);
        wait.until(d -> !d.findElements(By.cssSelector(".loading, .app-loading")).stream()
                .anyMatch(WebElement::isDisplayed));
    }

    public static void waitForVisible(WebDriver driver, By locator) {
        createWait(driver).until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    public static void waitForClickable(WebDriver driver, By locator) {
        createWait(driver).until(ExpectedConditions.elementToBeClickable(locator));
    }

    public static void waitForText(WebDriver driver, By locator, String text) {
        createWait(driver).until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    public static void waitForUrlContains(WebDriver driver, String partialUrl) {
        createWait(driver).until(ExpectedConditions.urlContains(partialUrl));
    }

    public static void acceptAlertIfPresent(WebDriver driver) {
        try {
            WebDriverWait wait = createWait(driver);
            wait.until(ExpectedConditions.alertIsPresent());
            driver.switchTo().alert().accept();
        } catch (Exception ignored) {
            // Pas d'alerte
        }
    }

    public static void acceptAlert(WebDriver driver) {
        createWait(driver).until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
    }

    public static boolean isElementPresent(WebDriver driver, By locator) {
        List<WebElement> elements = driver.findElements(locator);
        return !elements.isEmpty() && elements.get(0).isDisplayed();
    }
}
