package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProfilePage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[text()='Mon profil']");
    private static final By NOM_INPUT = By.cssSelector(".create-form input[placeholder='Nom']");
    private static final By PRENOM_INPUT = By.cssSelector(".create-form input[placeholder='Prénom']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(.,'Enregistrer')]");
    private static final By SUCCESS_MESSAGE = By.cssSelector(".success");

    public ProfilePage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/profil");
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public void updateNom(String nom) {
        type(NOM_INPUT, nom);
        click(SUBMIT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
    }

    public String getSuccessMessage() {
        WaitUtils.waitForVisible(driver, SUCCESS_MESSAGE);
        return getText(SUCCESS_MESSAGE);
    }
}
