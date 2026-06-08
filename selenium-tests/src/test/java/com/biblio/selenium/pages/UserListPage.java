package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class UserListPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Utilisateurs')]");
    private static final By NEW_USER_BUTTON = By.xpath("//button[contains(.,'Nouvel utilisateur')]");
    private static final By SEARCH_INPUT = By.cssSelector(".search-input");
    private static final By USERS_TABLE = By.cssSelector(".users-table");

    public UserListPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/users");
    }

    public boolean isOnUsersPage() {
        return driver.getCurrentUrl().contains("/users") && isDisplayed(PAGE_TITLE);
    }

    public boolean isDisplayed() {
        return isOnUsersPage();
    }

    public void clickNewUser() {
        click(NEW_USER_BUTTON);
    }

    public void createUser(String nom, String prenom, String email, String password) {
        clickNewUser();
        type(By.cssSelector(".create-form input[placeholder='Nom']"), nom);
        type(By.cssSelector(".create-form input[placeholder='Prénom']"), prenom);
        type(By.cssSelector(".create-form input[placeholder='Email']"), email);
        type(By.cssSelector(".create-form input[placeholder*='Mot de passe']"), password);
        click(By.cssSelector(".create-form button[type='submit']"));
        WaitUtils.createWait(driver).until(
                ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".create-form")));
        WaitUtils.waitForPageLoad(driver);
    }

    public void search(String query) {
        WaitUtils.waitForClickable(driver, SEARCH_INPUT);
        type(SEARCH_INPUT, query);
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean userExistsInTable(String email) {
        return driver.findElement(USERS_TABLE).getText().contains(email);
    }

    public void deleteUserByEmail(String email) {
        click(By.cssSelector("[data-testid='user-delete'][data-email='" + email + "']"));
        WaitUtils.acceptAlertIfPresent(driver);
        WaitUtils.waitForPageLoad(driver);
    }
}
