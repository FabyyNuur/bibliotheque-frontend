package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[text()='Inscription']");
    private static final By NOM_INPUT = By.id("nom");
    private static final By PRENOM_INPUT = By.id("prenom");
    private static final By EMAIL_INPUT = By.id("email");
    private static final By PASSWORD_INPUT = By.id("password");
    private static final By CONFIRM_PASSWORD_INPUT = By.id("confirmPassword");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(.,'inscrire')]");
    private static final By ERROR_MESSAGE = By.cssSelector(".error");

    public RegisterPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/register");
    }

    public void register(String nom, String prenom, String email, String password) {
        type(NOM_INPUT, nom);
        type(PRENOM_INPUT, prenom);
        type(EMAIL_INPUT, email);
        type(PASSWORD_INPUT, password);
        type(CONFIRM_PASSWORD_INPUT, password);
        click(SUBMIT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
        WaitUtils.waitForVisible(driver, By.xpath("//button[contains(.,'Déconnexion')]"));
    }

    public void registerWithMismatchPassword(String nom, String prenom, String email, String password, String confirm) {
        type(NOM_INPUT, nom);
        type(PRENOM_INPUT, prenom);
        type(EMAIL_INPUT, email);
        type(PASSWORD_INPUT, password);
        type(CONFIRM_PASSWORD_INPUT, confirm);
        click(SUBMIT_BUTTON);
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public String getErrorMessage() {
        WaitUtils.waitForVisible(driver, ERROR_MESSAGE);
        return getText(ERROR_MESSAGE);
    }
}
