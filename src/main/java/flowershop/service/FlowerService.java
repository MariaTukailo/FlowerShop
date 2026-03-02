package flowershop.service;

import flowershop.dto.FlowerDto;
import flowershop.entity.Bouquet;
import flowershop.entity.Flower;
import flowershop.exception.TransactionDemoException;
import flowershop.mapper.FlowerMapper;
import flowershop.repository.FlowerRepository;
import flowershop.repository.BouquetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlowerService {

    private final FlowerRepository flowerRepository;
    private final BouquetRepository bouquetRepository;
    private final BouquetService bouquetService; // Добавляем его сюда

    public List<FlowerDto> getAllFlowers() {
        return flowerRepository.findAll().stream()
                .map(FlowerMapper::toDto)
                .toList();
    }

    @Transactional
    public FlowerDto saveFlower(FlowerDto dto) {
        Flower flower = FlowerMapper.toEntity(dto);
        return FlowerMapper.toDto(flowerRepository.save(flower));
    }

    @Transactional
    public void deleteFlower(Long flowerId) {
        Flower flower = flowerRepository.findById(flowerId)
                .orElseThrow(() -> new TransactionDemoException("Цветок не найден"));

        List<Bouquet> allBouquets = bouquetRepository.findAll();
        for (Bouquet bouquet : allBouquets) {
            if (bouquet.getFlowers().contains(flower)) {

                bouquetService.delete(bouquet.getId());
            }
        }
        flowerRepository.delete(flower);
    }

    @Transactional
    public FlowerDto updateFlower(Long id, FlowerDto dto) {
        Flower flower = flowerRepository.findById(id)
                .orElseThrow(() -> new TransactionDemoException("Цветок не найден"));

        flower.setName(dto.getName());
        flower.setColor(dto.getColor());
        flower.setPrice(dto.getPrice());
        flower.setCatalogNumber(dto.getCatalogNumber());

        Flower updated = flowerRepository.save(flower);



        return FlowerMapper.toDto(updated);
    }

    public FlowerDto findFlowerByCatalogNumber(int id) {

        Flower flowerOther = flowerRepository.findAll().stream()
                .filter(flower -> flower.getCatalogNumber() == id)
                .findFirst().orElse(null);

        return FlowerMapper.toDto(flowerOther);
    }

    public List<FlowerDto> findFlowersByColor(String color) {

        if (color == null || color.isEmpty()) {
            return getAllFlowers();
        }

        return flowerRepository.findAll()
                .stream()
                .filter(flower -> flower.getColor().equalsIgnoreCase(color))
                .map(FlowerMapper::toDto)
                .toList();
    }
}