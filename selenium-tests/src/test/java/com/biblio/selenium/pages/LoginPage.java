package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[text()='Connexion']");
    private static final By EMAIL_INPUT = By.id("email");
    private static final By PASSWORD_INPUT = By.id("password");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(.,'connecter')]");
    private static final By ERROR_MESSAGE = By.cssSelector(".error");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/login");
    }

    public void login(String email, String password) {
        type(EMAIL_INPUT, email);
        type(PASSWORD_INPUT, password);
        click(SUBMIT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public String getErrorMessage() {
        WaitUtils.waitForVisible(driver, ERROR_MESSAGE);
        return getText(ERROR_MESSAGE);
    }

    public boolean hasError() {
        return isDisplayed(ERROR_MESSAGE);
    }
}
