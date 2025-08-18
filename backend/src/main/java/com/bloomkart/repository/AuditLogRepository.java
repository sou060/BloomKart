package com.bloomkart.repository;

import com.bloomkart.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
} 