package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
@RestController @RequestMapping("/api/work")
public class WorkController {
    private final CertificateRepository certs;
    private final HolderRepository holders;
    private final TenantRepository tenants;
    public WorkController(CertificateRepository certs, HolderRepository holders, TenantRepository tenants) {
        this.certs = certs; this.holders = holders; this.tenants = tenants;
    }
    @GetMapping
    public Map<String,Object> today() {
        Long tid = TenantContext.getTenantId();
        Tenant firm = tenants.findById(tid).orElseThrow();
        LocalDate today = LocalDate.now();
        Map<Long, Holder> hmap = new HashMap<>();
        holders.findByTenantId(tid).forEach(h -> hmap.put(h.getId(), h));
        List<Map<String,Object>> expired = new ArrayList<>();
        List<Map<String,Object>> soon = new ArrayList<>();
        for (Certificate c : certs.findByTenantId(tid)) {
            Holder h = hmap.get(c.getHolderId());
            String name = h==null?"":nvl(h.getName());
            String phone = h==null?"":nvl(h.getPhone());
            String fallback = "Namaste " + name + ", your Class-3 DSC (" + c.getSerialNo()
                + ") expires on " + c.getExpiresOn() + ". Please start video KYC renewal.";
            String msg = IndiaLinks.applyTemplate(firm.getReminderTemplate(), fallback, name, c.getExpiresOn(), c.getSerialNo());
            Map<String,Object> row = new LinkedHashMap<>();
            row.put("id", c.getId());
            row.put("holder", name);
            row.put("phone", phone);
            row.put("serialNo", c.getSerialNo());
            row.put("tokenSerial", c.getTokenSerial());
            row.put("expiresOn", c.getExpiresOn());
            row.put("portal", c.getPortal());
            row.put("reminder", msg);
            row.put("waLink", IndiaLinks.wa(phone, msg));
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
    @PostMapping("/renew/{id}")
    public Map<String,Object> renew(@PathVariable Long id, @RequestBody(required=false) Map<String,String> body) {
        Certificate c = certs.findById(id).orElseThrow();
        if (!TenantContext.getTenantId().equals(c.getTenantId())) throw new RuntimeException("forbidden");
        String next = body==null?null:body.get("expiresOn");
        if (next==null || next.isBlank()) {
            try { next = LocalDate.parse(c.getExpiresOn()).plusYears(2).toString(); }
            catch (Exception e) { next = LocalDate.now().plusYears(2).toString(); }
        }
        c.setExpiresOn(next);
        certs.save(c);
        return Map.of("id", c.getId(), "expiresOn", c.getExpiresOn());
    }
    private String nvl(String s){ return s==null?"":s; }
}
