package com.bloomkart.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/uploads")
public class FileController {

    @GetMapping("/{filename:.+}")
    public ResponseEntity<?> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                // Return JSON error, not PDF
                return ResponseEntity.status(404)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("error", "File not found"));
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Invalid file path"));
        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Could not serve file"));
        }
    }

    @GetMapping
    public ResponseEntity<List<String>> listFiles() {
        try {
            Path uploadsDir = Paths.get("uploads");
            if (!Files.exists(uploadsDir)) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            List<String> files = Files.list(uploadsDir)
                .filter(Files::isRegularFile)
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
            return ResponseEntity.ok(files);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Collections.singletonList("An unexpected error occurred"));
        }
    }
} 