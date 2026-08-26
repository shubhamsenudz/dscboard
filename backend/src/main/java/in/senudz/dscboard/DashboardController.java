package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
    private final TenantRepository tenants;
    public DashboardController(TenantRepository tenants){ this.tenants=tenants; }
    @GetMapping public Map<String,Object> stats(){
        Tenant t = tenants.findById(TenantContext.getTenantId()).orElseThrow();
        return Map.of("product", "DscBoard", "tenant", t.getName(), "tag", "Class-3 DSC and USB token register for CA firms and DSC agents.");
    }
}
