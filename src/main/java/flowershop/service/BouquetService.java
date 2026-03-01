package flowershop.service;

import flowershop.entity.Bouquet;
import flowershop.exception.TransactionDemoException;
import flowershop.repository.BouquetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BouquetService {

    private final BouquetRepository bouquetRepository;

    public List<Bouquet> getAllSimple() {
        return bouquetRepository.findAll();
    }

    public List<Bouquet> getAllWithFlowers() {
        return bouquetRepository.findAllWithFlowers();
    }

    public Bouquet getById(Long id) {
        return bouquetRepository.findById(id)
                .orElseThrow(() -> new TransactionDemoException("Букет с id " + id + " не найден"));
    }

    @Transactional
    public Bouquet save(Bouquet bouquet) {

        bouquet.setTotalCost(bouquet.calculateTotalCost());
        return bouquetRepository.save(bouquet);
    }

    @Transactional
    public Bouquet update(Long id, Bouquet details) {
        Bouquet bouquet = getById(id);

        bouquet.setCatalogNumber(details.getCatalogNumber());
        bouquet.setName(details.getName());
        bouquet.setWrappingPaper(details.isWrappingPaper());
        bouquet.setRibbon(details.isRibbon());

        if (details.getFlowers() != null) {

            bouquet.setFlowers(details.getFlowers());
        }


        bouquet.setTotalCost(bouquet.calculateTotalCost());
        return bouquetRepository.save(bouquet);
    }

    @Transactional
    public void delete(Long id) {
        Bouquet bouquet = getById(id);

        bouquetRepository.delete(bouquet);
    }
}