package flowershop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private LocalDateTime date;
    private LocalDate deliveryDate;
    private LocalTime deliveryTime;
    private double finalPrice;
    private String status;

    private Long customerId;

    private List<BouquetDto> bouquets;
}
