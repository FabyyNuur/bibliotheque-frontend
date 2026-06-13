package com.biblio.selenium.utils;

import com.biblio.selenium.config.TestConfig;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public final class TestDataCleaner {

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    private TestDataCleaner() {
    }

    public static void purgeSeleniumTestData() {
        try {
            String token = authenticate();
            if (token == null) {
                return;
            }

            returnSeleniumEmprunts(token);
            deleteSeleniumUsers(token);
            deleteSeleniumBooks(token);
        } catch (Exception e) {
            System.err.println("[TestDataCleaner] Nettoyage ignoré : " + e.getMessage());
        }
    }

    private static String authenticate() throws Exception {
        String body = """
                {"email":"%s","password":"%s"}
                """.formatted(TestConfig.getBiblioEmail(), TestConfig.getBiblioPassword());

        HttpResponse<String> response = HTTP.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(TestConfig.getApiUrl() + "/auth/login"))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(10))
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build(),
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() != 200) {
            return null;
        }

        JsonObject json = JsonParser.parseString(response.body()).getAsJsonObject();
        return json.get("token").getAsString();
    }

    private static void returnSeleniumEmprunts(String token) throws Exception {
        for (String endpoint : List.of("/emprunts/en-cours", "/emprunts/en-retard")) {
            JsonArray emprunts = fetchArray(token, TestConfig.getApiUrl() + endpoint);
            for (JsonElement element : emprunts) {
                JsonObject emprunt = element.getAsJsonObject();
                if (!isSeleniumEmprunt(emprunt)) {
                    continue;
                }
                String id = emprunt.get("id").getAsString();
                patch(token, TestConfig.getApiUrl() + "/emprunts/" + id + "/retour");
            }
        }
    }

    private static boolean isSeleniumEmprunt(JsonObject emprunt) {
        JsonObject utilisateur = emprunt.getAsJsonObject("utilisateur");
        JsonObject livre = emprunt.getAsJsonObject("livre");

        String email = utilisateur != null && utilisateur.has("email")
                ? utilisateur.get("email").getAsString()
                : null;
        String titre = livre != null && livre.has("titre")
                ? livre.get("titre").getAsString()
                : null;
        String isbn = livre != null && livre.has("isbn")
                ? livre.get("isbn").getAsString()
                : null;

        return TestDataFactory.isSeleniumTestEmail(email)
                || TestDataFactory.isSeleniumTestBook(titre, isbn);
    }

    private static void deleteSeleniumUsers(String token) throws Exception {
        JsonArray users = fetchArray(token, TestConfig.getApiUrl() + "/users");
        List<String> idsToDelete = new ArrayList<>();

        for (JsonElement element : users) {
            JsonObject user = element.getAsJsonObject();
            String email = user.get("email").getAsString();
            if (TestDataFactory.isSeleniumTestEmail(email)) {
                idsToDelete.add(user.get("id").getAsString());
            }
        }

        for (String id : idsToDelete) {
            delete(token, TestConfig.getApiUrl() + "/users/" + id);
        }
    }

    private static void deleteSeleniumBooks(String token) throws Exception {
        JsonArray books = fetchArray(token, TestConfig.getApiUrl() + "/books");
        List<String> idsToDelete = new ArrayList<>();

        for (JsonElement element : books) {
            JsonObject book = element.getAsJsonObject();
            String titre = book.get("titre").getAsString();
            String isbn = book.has("isbn") ? book.get("isbn").getAsString() : null;
            if (TestDataFactory.isSeleniumTestBook(titre, isbn)) {
                idsToDelete.add(book.get("id").getAsString());
            }
        }

        for (String id : idsToDelete) {
            delete(token, TestConfig.getApiUrl() + "/books/" + id);
        }
    }

    private static JsonArray fetchArray(String token, String url) throws Exception {
        HttpResponse<String> response = HTTP.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + token)
                        .timeout(Duration.ofSeconds(15))
                        .GET()
                        .build(),
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() != 200) {
            return new JsonArray();
        }

        return JsonParser.parseString(response.body()).getAsJsonArray();
    }

    private static void patch(String token, String url) throws Exception {
        HTTP.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + token)
                        .timeout(Duration.ofSeconds(10))
                        .method("PATCH", HttpRequest.BodyPublishers.noBody())
                        .build(),
                HttpResponse.BodyHandlers.discarding()
        );
    }

    private static void delete(String token, String url) throws Exception {
        HTTP.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + token)
                        .timeout(Duration.ofSeconds(10))
                        .DELETE()
                        .build(),
                HttpResponse.BodyHandlers.discarding()
        );
    }
}
