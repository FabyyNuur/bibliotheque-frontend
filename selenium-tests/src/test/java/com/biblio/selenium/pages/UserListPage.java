package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class UserListPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Utilisateurs')]");
    private static final By NEW_USER_BUTTON = By.cssSelector("[data-testid='user-create-open']");
    private static final By CREATE_MODAL = By.cssSelector("[data-testid='user-create-modal']");
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
        WaitUtils.waitForVisible(driver, CREATE_MODAL);
    }

    public void createUser(String nom, String prenom, String email) {
        clickNewUser();
        type(By.cssSelector("[data-testid='user-create-modal'] input[placeholder='Nom']"), nom);
        type(By.cssSelector("[data-testid='user-create-modal'] input[placeholder='Prénom']"), prenom);
        type(By.cssSelector("[data-testid='user-create-modal'] input[placeholder='Email']"), email);
        click(By.cssSelector("[data-testid='user-create-submit']"));
        WaitUtils.createWait(driver).until(
                ExpectedConditions.invisibilityOfElementLocated(CREATE_MODAL));
        WaitUtils.waitForPageLoad(driver);
    }

    public void search(String query) {
        WaitUtils.waitForClickable(driver, SEARCH_INPUT);
        type(SEARCH_INPUT, query);
        WaitUtils.waitForPageLoad(driver);
    }

    public void waitForUserInTable(String email) {
        WaitUtils.waitForText(driver, USERS_TABLE, email);
    }

    public boolean userExistsInTable(String email) {
        waitForUserInTable(email);
        return driver.findElement(USERS_TABLE).getText().contains(email);
    }

    public void deleteUserByEmail(String email) {
        click(By.cssSelector("[data-testid='user-delete'][data-email='" + email + "']"));
        WaitUtils.waitForClickable(driver, By.cssSelector("[data-testid='confirm-modal-confirm']"));
        click(By.cssSelector("[data-testid='confirm-modal-confirm']"));
        WaitUtils.waitForPageLoad(driver);
    }
}
