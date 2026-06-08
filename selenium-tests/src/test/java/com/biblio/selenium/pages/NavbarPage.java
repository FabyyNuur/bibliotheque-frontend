package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class NavbarPage extends BasePage {

    private static final By NAV_TITLE = By.cssSelector(".nav-title");
    private static final By LOGOUT_BUTTON = By.xpath("//button[contains(.,'Déconnexion')]");
    private static final By LOGIN_LINK = By.linkText("Connexion");
    private static final By CATALOGUE_LINK = By.linkText("Catalogue");

    public NavbarPage(WebDriver driver) {
        super(driver);
    }

    public String getTitle() {
        return getText(NAV_TITLE);
    }

    public void clickNavLink(String linkText) {
        click(By.linkText(linkText));
        WaitUtils.waitForPageLoad(driver);
    }

    public void logout() {
        click(LOGOUT_BUTTON);
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean isLogoutVisible() {
        return isDisplayed(LOGOUT_BUTTON);
    }

    public boolean isLoginLinkVisible() {
        return isDisplayed(LOGIN_LINK);
    }

    public boolean isCatalogueLinkVisible() {
        return isDisplayed(CATALOGUE_LINK);
    }
}
