package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class BookListPage extends BasePage {

    private static final By PAGE_TITLE_CATALOGUE = By.xpath("//h2[contains(text(),'Catalogue') or contains(text(),'Livres')]");
    private static final By SEARCH_INPUT = By.cssSelector(".search-input");
    private static final By NEW_BOOK_BUTTON = By.xpath("//button[contains(.,'Nouveau livre')]");
    private static final By BOOK_CARDS = By.cssSelector(".book-card");
    private static final By ERROR_MESSAGE = By.cssSelector(".error");
    private static final By SUCCESS_MESSAGE = By.cssSelector(".success");
    private static final By EMPTY_STATE = By.cssSelector(".empty-state");

    public BookListPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/books");
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE_CATALOGUE);
    }

    public void search(String query) {
        type(SEARCH_INPUT, query);
        WaitUtils.waitForPageLoad(driver);
    }

    public void clickNewBook() {
        click(NEW_BOOK_BUTTON);
    }

    public void fillBookForm(String titre, String auteur, String isbn, String genre) {
        type(By.cssSelector(".create-form input[placeholder='Titre']"), titre);
        type(By.cssSelector(".create-form input[placeholder='Auteur']"), auteur);
        type(By.cssSelector(".create-form input[placeholder='ISBN']"), isbn);
        type(By.cssSelector(".create-form input[placeholder='Genre']"), genre);
    }

    public void submitBookForm() {
        click(By.cssSelector(".create-form button[type='submit']"));
        WaitUtils.createWait(driver).until(
                ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".create-form")));
        WaitUtils.waitForPageLoad(driver);
    }

    public void createBook(String titre, String auteur, String isbn, String genre) {
        clickNewBook();
        fillBookForm(titre, auteur, isbn, genre);
        submitBookForm();
    }

    public void clickBorrowOnFirstAvailable() {
        click(By.xpath("(//button[contains(.,'Emprunter') and not(@disabled)])[1]"));
        WaitUtils.waitForPageLoad(driver);
    }

    public void clickEditOnBook(String titre) {
        click(By.xpath("//div[contains(@class,'book-card')][.//*[contains(text(),'" + titre + "')]]//button[contains(.,'Modifier')]"));
    }

    public void clickDeleteOnBook(String titre) {
        click(By.xpath("//div[contains(@class,'book-card')][.//*[contains(text(),'" + titre + "')]]//button[contains(.,'Supprimer')]"));
        WaitUtils.acceptAlert(driver);
        WaitUtils.waitForPageLoad(driver);
    }

    public void updateBookTitle(String newTitle) {
        var titleInput = driver.findElement(By.cssSelector(".create-form input[placeholder='Titre']"));
        titleInput.clear();
        titleInput.sendKeys(newTitle);
        submitBookForm();
    }

    public boolean bookExists(String titre) {
        return !driver.findElements(
                By.xpath("//div[contains(@class,'book-card')][.//*[contains(text(),'" + titre + "')]]")
        ).isEmpty();
    }

    public int getBookCardCount() {
        return driver.findElements(BOOK_CARDS).size();
    }

    public boolean hasBorrowButton() {
        return isDisplayed(By.xpath("//button[contains(.,'Emprunter')]"));
    }

    public String getSuccessMessage() {
        WaitUtils.waitForVisible(driver, SUCCESS_MESSAGE);
        return getText(SUCCESS_MESSAGE);
    }

    public String getErrorMessage() {
        WaitUtils.waitForVisible(driver, ERROR_MESSAGE);
        return getText(ERROR_MESSAGE);
    }

    public boolean isEmptyStateDisplayed() {
        return isDisplayed(EMPTY_STATE);
    }
}
