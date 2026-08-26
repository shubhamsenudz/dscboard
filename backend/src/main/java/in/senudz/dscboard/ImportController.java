package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
@RestController @RequestMapping("/api/import")
public class ImportController {
    private final HolderRepository holders;
    public ImportController(HolderRepository holders) { this.holders = holders; }
    @PostMapping("/holders")
    public Map<String,Integer> holders(@RequestBody Map<String,String> body) {
        int n = 0; Long tid = TenantContext.getTenantId();
        for (Map<String,String> row : Csv.parse(body.get("csv"))) {
            Holder h = new Holder();
            h.setTenantId(tid);
            h.setName(row.getOrDefault("name", row.get("Name")));
            h.setPan(row.getOrDefault("pan", row.get("PAN")));
            h.setPhone(row.getOrDefault("phone", row.get("Phone")));
            h.setCreatedAt(Instant.now().toString());
            holders.save(h); n++;
        }
        return Map.of("imported", n);
    }
}
