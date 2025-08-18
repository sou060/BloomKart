package com.bloomkart.service;

import com.bloomkart.entity.AuditLog;
import com.bloomkart.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String details, String performedBy) {
        AuditLog log = new AuditLog(action, details, performedBy);
        auditLogRepository.save(log);
    }
} 