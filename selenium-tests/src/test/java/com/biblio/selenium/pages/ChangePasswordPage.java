package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ChangePasswordPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Changer votre mot de passe')]");
    private static final By CURRENT_PASSWORD_INPUT = By.id("current-password");
    private static final By NEW_PASSWORD_INPUT = By.id("new-password");
    private static final By CONFIRM_PASSWORD_INPUT = By.id("confirm-password");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(.,'nouveau mot de passe')]");
    private static final By ERROR_MESSAGE = By.cssSelector(".auth-card .error");

    public ChangePasswordPage(WebDriver driver) {
        super(driver);
    }

    public void waitUntilDisplayed() {
        WaitUtils.waitForVisible(driver, PAGE_TITLE);
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public void changePassword(String currentPassword, String newPassword) {
        fillPasswordForm(currentPassword, newPassword);
        click(SUBMIT_BUTTON);
        waitUntilLeftPage();
    }

    public void submitNewPassword(String currentPassword, String newPassword) {
        fillPasswordForm(currentPassword, newPassword);
        click(SUBMIT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
    }

    public void waitUntilLeftPage() {
        WaitUtils.createWait(driver).until(
                ExpectedConditions.not(ExpectedConditions.urlContains("/change-password")));
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean hasError() {
        return isDisplayed(ERROR_MESSAGE);
    }

    public String getErrorMessage() {
        WaitUtils.waitForVisible(driver, ERROR_MESSAGE);
        return getText(ERROR_MESSAGE);
    }

    private void fillPasswordForm(String currentPassword, String newPassword) {
        waitUntilDisplayed();
        type(CURRENT_PASSWORD_INPUT, currentPassword);
        type(NEW_PASSWORD_INPUT, newPassword);
        type(CONFIRM_PASSWORD_INPUT, newPassword);
    }
}
