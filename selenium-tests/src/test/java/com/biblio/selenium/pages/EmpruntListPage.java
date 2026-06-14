package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class EmpruntListPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Emprunts')]");
    private static final By NEW_EMPRUNT_BUTTON = By.cssSelector("[data-testid='emprunt-create-open']");
    private static final By CREATE_MODAL = By.cssSelector("[data-testid='emprunt-create-modal']");
    private static final By USER_SEARCH = By.cssSelector("[data-testid='emprunt-user-select-search']");
    private static final By BOOK_SEARCH = By.cssSelector("[data-testid='emprunt-book-select-search']");
    private static final By SUBMIT_BUTTON = By.cssSelector("[data-testid='emprunt-create-submit']");
    private static final By EMPRUNTS_TABLE = By.cssSelector(".emprunts-table");

    public EmpruntListPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/emprunts");
    }

    public boolean isOnEmpruntsPage() {
        return driver.getCurrentUrl().contains("/emprunts") && isDisplayed(PAGE_TITLE);
    }

    public boolean isDisplayed() {
        return isOnEmpruntsPage();
    }

    public void clickFilter(String filterName) {
        click(By.xpath("//button[text()='" + filterName + "']"));
        WaitUtils.waitForPageLoad(driver);
    }

    public void clickNewEmprunt() {
        click(NEW_EMPRUNT_BUTTON);
        WaitUtils.waitForVisible(driver, CREATE_MODAL);
    }

    public void createEmpruntForUser(String userEmail, String bookTitle) {
        clickNewEmprunt();
        selectSearchableOption(USER_SEARCH, userEmail);
        selectSearchableOption(BOOK_SEARCH, bookTitle);
        click(SUBMIT_BUTTON);
        WaitUtils.createWait(driver).until(
                ExpectedConditions.invisibilityOfElementLocated(CREATE_MODAL));
        WaitUtils.waitForPageLoad(driver);
    }

    private void selectSearchableOption(By searchInput, String query) {
        type(searchInput, query);
        click(By.xpath(
                "//li[contains(@class,'searchable-select-option') and contains(.,'" + query + "')]"));
    }

    public void returnFirstActiveLoan() {
        click(By.cssSelector("[data-testid='emprunt-return']"));
        WaitUtils.acceptAlertIfPresent(driver);
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean tableContainsText(String text) {
        WaitUtils.waitForVisible(driver, EMPRUNTS_TABLE);
        return driver.findElement(EMPRUNTS_TABLE).getText().contains(text);
    }
}
