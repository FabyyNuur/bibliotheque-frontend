package com.biblio.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {

    private static final By PAGE_TITLE = By.cssSelector(".dashboard h2");
    private static final By WELCOME_MESSAGE = By.xpath("//*[contains(@class,'dashboard')]//h3 | //*[contains(text(),'Bienvenue')]");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/");
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public String getPageTitle() {
        return getText(PAGE_TITLE);
    }

    public boolean hasWelcomeMessage() {
        return driver.getPageSource().contains("Bienvenue");
    }
}
