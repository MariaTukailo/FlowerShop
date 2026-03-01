package flowershop.controller;

import flowershop.entity.Bouquet;
import flowershop.service.BouquetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

@RestController
@RequestMapping("/bouquets")
@RequiredArgsConstructor
public class BouquetController {

    private final BouquetService bouquetService;

    @GetMapping("/simple")
    public List<Bouquet> getAllSimple() {
        return bouquetService.getAllSimple();
    }

    @GetMapping("/with-flowers")
    public List<Bouquet> getAllWithFlowers() {
        return bouquetService.getAllWithFlowers();
    }

    @GetMapping("/{id}")
    public Bouquet getById(@PathVariable Long id) {
        return bouquetService.getById(id);
    }

    @PostMapping
    public Bouquet create(@RequestBody Bouquet bouquet) {
        return bouquetService.save(bouquet);
    }

    @PutMapping("/{id}")
    public Bouquet update(@PathVariable Long id, @RequestBody Bouquet details) {
        return bouquetService.update(id, details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bouquetService.delete(id);
    }
}