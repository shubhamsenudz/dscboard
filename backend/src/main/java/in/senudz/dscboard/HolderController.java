package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/holders")
public class HolderController {
    private final HolderRepository repo;
    public HolderController(HolderRepository repo){ this.repo = repo; }
    @GetMapping public List<Holder> list(){ return repo.findByTenantId(TenantContext.getTenantId()); }
    @PostMapping public Holder create(@RequestBody Holder body){
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return repo.save(body);
    }
    @PutMapping("/{id}") public Holder update(@PathVariable Long id, @RequestBody Holder body){
        Holder e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        if(body.getName()!=null) e.setName(body.getName());
        if(body.getPan()!=null) e.setPan(body.getPan());
        if(body.getPhone()!=null) e.setPhone(body.getPhone());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){
        Holder e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        repo.delete(e);
    }
}
