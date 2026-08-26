package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
@RestController @RequestMapping("/api/work")
public class WorkController {
    private final CertificateRepository certs;
    private final HolderRepository holders;
    public WorkController(CertificateRepository certs, HolderRepository holders) {
        this.certs = certs; this.holders = holders;
    }
    @GetMapping
    public Map<String,Object> today() {
        Long tid = TenantContext.getTenantId();
        LocalDate today = LocalDate.now();
        Map<Long,String> names = new HashMap<>();
        holders.findByTenantId(tid).forEach(h -> names.put(h.getId(), h.getName()));
        List<Map<String,Object>> expired = new ArrayList<>();
        List<Map<String,Object>> soon = new ArrayList<>();
        for (Certificate c : certs.findByTenantId(tid)) {
            Map<String,Object> row = new LinkedHashMap<>();
            row.put("id", c.getId());
            row.put("holder", names.getOrDefault(c.getHolderId(), ""));
            row.put("serialNo", c.getSerialNo());
            row.put("tokenSerial", c.getTokenSerial());
            row.put("expiresOn", c.getExpiresOn());
            row.put("portal", c.getPortal());
            try {
                LocalDate exp = LocalDate.parse(c.getExpiresOn());
                long days = java.time.temporal.ChronoUnit.DAYS.between(today, exp);
                row.put("daysLeft", days);
                if (exp.isBefore(today) || days <= 0) expired.add(row);
                else if (days <= 30) soon.add(row);
            } catch (Exception e) { soon.add(row); }
        }
        return Map.of("expired", expired, "expiring30", soon, "alerts", expired.size() + soon.size());
    }
}
