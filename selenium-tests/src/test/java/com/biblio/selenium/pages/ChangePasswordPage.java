package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ChangePasswordPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Changer votre mot de passe')]");
    private static final By CURRENT_PASSWORD_INPUT = By.id("current-password");
    private static final By NEW_PASSWORD_INPUT = By.id("new-password");
    private static final By CONFIRM_PASSWORD_INPUT = By.id("confirm-password");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(.,'nouveau mot de passe')]");

    public ChangePasswordPage(WebDriver driver) {
        super(driver);
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public void changePassword(String currentPassword, String newPassword) {
        WaitUtils.waitForVisible(driver, PAGE_TITLE);
        type(CURRENT_PASSWORD_INPUT, currentPassword);
        type(NEW_PASSWORD_INPUT, newPassword);
        type(CONFIRM_PASSWORD_INPUT, newPassword);
        click(SUBMIT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
    }
}
