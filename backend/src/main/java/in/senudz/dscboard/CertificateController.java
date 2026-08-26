package in.senudz.dscboard;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/certificates")
public class CertificateController {
    private final CertificateRepository repo;
    public CertificateController(CertificateRepository repo){ this.repo = repo; }
    @GetMapping public List<Certificate> list(){ return repo.findByTenantId(TenantContext.getTenantId()); }
    @PostMapping public Certificate create(@RequestBody Certificate body){
        body.setId(null); body.setTenantId(TenantContext.getTenantId()); body.setCreatedAt(Instant.now().toString());
        return repo.save(body);
    }
    @PutMapping("/{id}") public Certificate update(@PathVariable Long id, @RequestBody Certificate body){
        Certificate e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        if(body.getHolderId()!=null) e.setHolderId(body.getHolderId());
        if(body.getSerialNo()!=null) e.setSerialNo(body.getSerialNo());
        if(body.getTokenSerial()!=null) e.setTokenSerial(body.getTokenSerial());
        if(body.getDscClass()!=null) e.setDscClass(body.getDscClass());
        if(body.getExpiresOn()!=null) e.setExpiresOn(body.getExpiresOn());
        if(body.getPortal()!=null) e.setPortal(body.getPortal());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){
        Certificate e = repo.findById(id).orElseThrow();
        if(!e.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("forbidden");
        repo.delete(e);
    }
}
