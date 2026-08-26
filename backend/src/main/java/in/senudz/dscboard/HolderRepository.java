package in.senudz.dscboard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HolderRepository extends JpaRepository<Holder, Long> {
    List<Holder> findByTenantId(Long tenantId);
}
