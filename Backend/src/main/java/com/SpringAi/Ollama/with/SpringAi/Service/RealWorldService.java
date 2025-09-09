package com.SpringAi.Ollama.with.SpringAi.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class RealWorldService {
    private final ZoneId zone;

    public RealWorldService(@Value("${app.timezone:Asia/Kolkata}") String tz) {
        this.zone = ZoneId.of(tz);
    }

    public boolean looksLikeDateOrTime(String text) {
        if (text == null) return false;
        String t = text.toLowerCase(Locale.ROOT);
        return t.matches(".*\\b(date|time|today|day)\\b.*")
                || t.matches(".*\\b(aaj|samay|waqt)\\b.*"); // simple Hinglish triggers
    }

    // Handles date, time, or both in one message (EN/Hinglish minimal)
    public String answerDateOrTime(String text) {
        ZonedDateTime now = ZonedDateTime.now(zone);
        String t = text.toLowerCase(Locale.ROOT);
        boolean askTime = t.contains("time") || t.contains("samay") || t.contains("waqt");
        boolean askDate = t.contains("date") || t.contains("today") || t.contains("aaj") || t.contains("day");

        if (askTime && askDate) {
            return "It’s " + now.format(DateTimeFormatter.ofPattern("EEEE, d MMM uuuu", Locale.ENGLISH))
                    + " and the time is " + now.format(DateTimeFormatter.ofPattern("h:mm a z", Locale.ENGLISH)) + ".";
        } else if (askTime) {
            return "Current time: " + now.format(DateTimeFormatter.ofPattern("h:mm a z", Locale.ENGLISH)) + ".";
        } else if (askDate) {
            return "Today is " + now.format(DateTimeFormatter.ofPattern("EEEE, d MMM uuuu", Locale.ENGLISH))
                    + " (" + zone + ").";
        }
        return "It’s " + now.format(DateTimeFormatter.ofPattern("EEEE, d MMM uuuu 'at' h:mm a z", Locale.ENGLISH)) + ".";
    }
}
