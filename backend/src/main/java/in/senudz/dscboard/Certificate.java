package in.senudz.dscboard;
import jakarta.persistence.*;
@Entity @Table(name="certificates")
public class Certificate {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private Long holderId;
    private String serialNo;
    private String tokenSerial;
    private String dscClass;
    private String expiresOn;
    private String portal;
    private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTenantId(){return tenantId;}
    public void setTenantId(Long tenantId){this.tenantId=tenantId;}
    public Long getHolderId(){return holderId;}
    public void setHolderId(Long holderId){this.holderId=holderId;}
    public String getSerialNo(){return serialNo;}
    public void setSerialNo(String serialNo){this.serialNo=serialNo;}
    public String getTokenSerial(){return tokenSerial;}
    public void setTokenSerial(String tokenSerial){this.tokenSerial=tokenSerial;}
    public String getDscClass(){return dscClass;}
    public void setDscClass(String dscClass){this.dscClass=dscClass;}
    public String getExpiresOn(){return expiresOn;}
    public void setExpiresOn(String expiresOn){this.expiresOn=expiresOn;}
    public String getPortal(){return portal;}
    public void setPortal(String portal){this.portal=portal;}
    public String getCreatedAt(){return createdAt;}
    public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
